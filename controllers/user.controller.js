import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

export const register = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password, role } = req.body;
        const file = req.file;

        if (!fullname || !email || !phoneNumber || !password || !role || !file)
            return res.status(400).json({
                message: "All fields are required",
                success: false
            });


        const fileUri = getDataUri(file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
            folder: 'user_profile', // Organize files under a specific folder in Cloudinary
            resource_type: "auto", // Let Cloudinary determine the file type
            transformation: [
                { quality: "auto:good" }, // Optimize quality
                { fetch_format: "auto" }, // Use the best file format (e.g., webp, etc.)
            ],
        });

        //check if user already exists
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                message: "User already exists",
                success: false
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
            profile: {
                profilePhoto: cloudResponse.secure_url,
            }
        });

        return res.status(201).json({
            message: "Account created successfully",
            success: true
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "An error occurred while signing in",
            success: false
        });
    }
}

export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        // Check if all fields are provided
        if (!email || !password || !role) {
            return res.status(400).json({
                message: "All fields are required",
                success: false,
            });
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Incorrect email or password",
                success: false,
            });
        }

        // Check if password matches
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect email or password",
                success: false,
            });
        }

        // Check if role matches the user's role
        if (role !== user.role) {
            return res.status(400).json({
                message: "Account does not have this role",
                success: false,
            });
        }

        // Generate JWT token
        const tokenData = {
            userId: user._id,
        };
        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });
       
        // Set the cookie with token
        return res
            .status(200)
            .cookie("token", token, {
                maxAge: 1 * 24 * 60 * 60 * 1000,                  // 1 day expiration
                httpOnly: true,                                   // Ensures the cookie is not accessible via JavaScript
                secure: process.env.NODE_ENV === 'production',    // Set to true in production
                sameSite: 'None',                          
                secure: true,                                 
            })
            .json({
                message: `Welcome, ${user.fullname}! You are now logged in as a ${user.role}.`,
                user: {
                    ...user._doc,
                    password: undefined, // Exclude the password field from the response
                },
                success: true,
            });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Something went wrong. Please try again later.",
            success: false,
        });
    }
};

export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully",
            success: true
        });
    } catch (error) {
        console.log(error);
    }
}

export const updateProfile = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, bio, skills, role } = req.body;
        const file = req.file;

        // Get file URI and upload to Cloudinary with optimizations

        let fileUri, cloudResponse;

        if (file) {
            fileUri = getDataUri(file);
            cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
                folder: 'user_resumes', // Organize files under a specific folder in Cloudinary
                resource_type: "auto", // Let Cloudinary determine the file type
                transformation: [
                    { quality: "auto:good" }, // Optimize quality
                    { fetch_format: "auto" }, // Use the best file format (e.g., webp, etc.)
                ],
            });
        }

        let skillsArray;
        if (skills) {
            skillsArray = skills.split(',');
        }

        const userId = req.id; //middleware authentication
        let user = await User.findById(userId);

        if (!user)
            return res.status(400).json({
                message: "User not found",
                success: false
            });

        // Updating data    
        if (fullname) user.fullname = fullname;
        if (email) user.email = email;
        if (phoneNumber) user.phoneNumber = phoneNumber;
        if (bio) user.profile.bio = bio;
        if (skills) user.profile.skills = skillsArray;
        if (role) user.role = role;

        // Save optimized Cloudinary resume URL
        if (cloudResponse) {
            user.profile.resume = cloudResponse.secure_url; // Optimized Cloudinary URL
            user.profile.resumeOriginalName = file.originalname; // Original file name
        }

        await user.save();

        return res.status(200).json({
            message: "Profile updated successfully",
            user: {
                ...user._doc,
                password: undefined,
            },
            success: true
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "An error occurred while updating the profile",
            success: false
        });
    }
};

export const updateProfilePic = async (req, res) => {
    try {

        const file = req.file;
        if (!file)
            return res.status(400).json({
                message: "Image not selected for upload",
                success: false
            });

        // Get file URI and upload to Cloudinary with optimizations
        const fileUri = getDataUri(file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
            folder: 'user_profile', // Organize files under a specific folder in Cloudinary
            resource_type: "auto", // Let Cloudinary determine the file type
            transformation: [
                { quality: "auto:good" }, // Optimize quality
                { fetch_format: "auto" }, // Use the best file format (e.g., webp, etc.)
            ],
        });


        const userId = req.id; //middleware authentication
        let user = await User.findById(userId);

        if (!user)
            return res.status(400).json({
                message: "User not found",
                success: false
            });

        // Save optimized Cloudinary resume URL
        if (cloudResponse) {
            user.profile.profilePhoto = cloudResponse.secure_url; // Optimized Cloudinary URL
            // user.profile.profilePhotoName = file.originalname; // Original file name
        }

        await user.save();

        return res.status(200).json({
            message: "Profile Picture updated successfully",
            user: {
                ...user._doc,
                password: undefined,
            },
            success: true
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "An error occurred while updating the profile picture",
            success: false
        });
    }
};