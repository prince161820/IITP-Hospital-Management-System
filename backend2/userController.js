import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
//import { Appointment } from "../models/appointmentSchema.js";
import cloudinary from "cloudinary"
import { User } from "../models/userSchema.js";
import{generateToken}from "../utils/jwtToken.js"
export const patientRegister= catchAsyncErrors(async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    password,
    nic,
    dob,
    gender,
    role,
    //appointment_date,
//department,
 //   doctor_firstName,
 //   doctor_lastName,
    //hasVisited,
    //address,
  } = req.body;
  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !nic ||
    !dob ||
    !gender ||
    !password||
    !role
   // !appointment_date ||
//!department ||
   // !doctor_firstName ||
    //!doctor_lastName ||
    //!address
  ) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }
  let user= await User.findOne({email});
  if(user){
       return next(new ErrorHandler("User already registerd", 400));
  }
  user = await User.create({
    firstName,
    lastName,
    email,
    phone,
    password,
    nic,
    dob,
    gender,
    role 
  });
   generateToken(user, "user registered!", 200, res);
  
  });
  
       export const login= catchAsyncErrors(async(req, res, next)=>{
           const{
             email, password, confirmPassword, role
           }= req.body;
           if(!email || !password || !confirmPassword|| !role){
              return next( new ErrorHandler("please Provide all details", 400));

           }
          if(password !==confirmPassword){
             return next( new ErrorHandler("password and confirm password do nto match", 400));
          }
          const user= await User. findOne({email}).select("+password");
          if(!user){
            return next( new ErrorHandler("Invalid password or Email!", 400));   
          }
        const isPasswordMatched= await user. comparePassword(password);
        if(!isPasswordMatched){
             return next(new ErrorHandler("Invalid password or Email!", 400));
        }
        if(role !== user.role){
            return next(new ErrorHandler("user with this role not found", 400));
        }
        generateToken(user, "user loggedin successfully!", 200, res);
         
       });

      export const addNewAdmin=  catchAsyncErrors(async(req, res, next)=>{
         const {
          firstName,
          lastName,
          email,
          phone,
          password,
          nic,
          dob,
          gender
         }= req.body;
         if (
          !firstName ||
          !lastName ||
          !email ||
          !phone ||
          !nic ||
          !dob ||
          !gender ||
          !password){
             return next ( new ErrorHandler("please fill full form", 400));
          }
           const isRegistered= await User.findOne({email});   
           if(isRegistered){
             return next(new ErrorHandler("Admin with This Eamil already exists! "));
           }
           const admin= await User.create({
            firstName,
            lastName,
            email,
            phone,
            password,
            nic,
            dob,
            gender,
            role: "Admin",
           });
           res .status(200).json({
             success:  true,
             message: "New admin registered!"
           }) 

      });
      
       export const getAllDoctors= catchAsyncErrors(async(req, res, next)=>{
               const doctors =await User.find({role: "Doctor"});
               res.status(200).json({
                 success: true,
                 doctors
               });
       });
       export const getUserDetails= catchAsyncErrors(async(req, res, next)=>{
         const user= req.user;
         res.status(200).
          json({
          success: true,
           user,
         })
       });
      export const logoutAdmin= catchAsyncErrors(async(req, res, next)=>{
        res.status(200)
        .cookie("adminToken","",{
          httpOnly: true,
          expires: new Date(Date.now()),
         }).json({
          success: true,
           message: "Admin logged Out successfully!",
      })
    });

    export const logoutPatient= catchAsyncErrors(async(req, res, next)=>{
      res.status(200)
      .cookie("patientToken","",{
        httpOnly: true,
        expires: new Date(Date.now()),
       }).json({
        success: true,
         message: "Patient logged Out successfully!",
    })
  });
  export const addNewDoctor=  catchAsyncErrors(async(req, res, next)=>{
     if(!req.files || Object.keys(req.files).length===0){
        return next(new ErrorHandler("Doctor avtar required", 400));
     }
         const{docAvatar}= req.files;
         const allowedFormats= ["images/png", "image/jpeg", "image/webp" ];
          if(!allowedFormats.includes(docAvatar.mimetype)){
              return next(new ErrorHandler("File Format Not Supported!", 400));
          }

           const{
            firstName,
            lastName,
            email,
            phone,
            password,
            nic,
            dob,
            gender,
            doctorDepartment
           }= req.body;
            if(
              !firstName ||
              !lastName ||
              !email ||
              !phone ||
              !password ||
              !nic ||
              !dob ||
              !gender ||
              !doctorDepartment
            ){
                return next(new ErrorHandler("please provide Full Details", 400));
            }
            const isRegistered = await User.findOne({email});
            if(isRegistered){
              return next(new ErrorHandler(`${isRegistered}  already registered with this email`, 400));   
            }
            const cloudinaryResponse= await cloudinary.uploader.upload(
              docAvatar.tempFilePath
            );
            if(!cloudinaryResponse || cloudinaryResponse.error){
                console.error("cloudinary Error", cloudinaryResponse.error || "unknown cloudinary Error");
            }
            const doctor=  await User.create({
              firstName,
              lastName,
              email,
              phone,
              password,
              nic,
              dob,
              gender,
              doctorDepartment,
              role: "Doctor",
              docAvatar:{
                  public_id: cloudinaryResponse.public_id,
                  url: cloudinaryResponse.secure_url,

              },
            });
            res.status(200).json({
               success: true,
               message: "new doctor Registered",
               doctor

            });
  });

          
   /*
     const isConflict = await User.find({
    firstName: doctor_firstName,
    lastName: doctor_lastName,
    role: "Doctor",
    doctorDepartment: department,
  });
  if (isConflict.length === 0) {
    return next(new ErrorHandler("Doctor not found", 404));
  }

  if (isConflict.length > 1) {
    return next(
      new ErrorHandler(
        "Doctors Conflict! Please Contact Through Email Or Phone!",
        400
      )
    );
  }

  const doctorId = isConflict[0]._id;
  const patientId = req.user._id;
  const appointment = await Appointment.create({
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    appointment_date,
    department,
    doctor: {
      firstName: doctor_firstName,
      lastName: doctor_lastName,
    },
    hasVisited,
    address,
    doctorId,
    patientId,
  });
  res.status(200).json({
    success: true,
    appointment,
    message: "Appointment Send!",
  });
});

export const getAllAppointments = catchAsyncErrors(async (req, res, next) => {
  const appointments = await Appointment.find();
  res.status(200).json({
    success: true,
    appointments,
  });
});
export const updateAppointmentStatus = catchAsyncErrors(
  async (req, res, next) => {
    const { id } = req.params;
    let appointment = await Appointment.findById(id);
    if (!appointment) {
      return next(new ErrorHandler("Appointment not found!", 404));
    }
    appointment = await Appointment.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
    res.status(200).json({
      success: true,
      message: "Appointment Status Updated!",    
    });
  }
);
export const deleteAppointment = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const appointment = await Appointment.findById(id);
  if (!appointment) {
    return next(new ErrorHandler("Appointment Not Found!", 404));
  }
  await appointment.deleteOne();
  res.status(200).json({
    success: true,
    message: "Appointment Deleted!",
  });
});        

   */