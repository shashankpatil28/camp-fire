const express = require('express');
const router = express.Router({ mergeParams: true });
const Campground = require('../models/campground');
const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');
const { campgroundSchema } = require('../schemas');
const { isLoggedIn } = require('../middleware');
const flash = require('flash');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

const { cloudinary } = require("../cloudinary");


// const temp = require('../cloudinary/index.js');
// const storage = temp.storage;
// const isImage = temp.isImage;
// const uploadOnCloudinary = temp.uploadOnCloudinary;
// const upload = multer({
//     storage:storage,
//     fileFilter:isImage
// })


const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

const isAuthors = async (req, res, next) => {
    const { id } = req.params;
    const data = await Campground.findById(id);
    if(!data.author.equals(req.user._id)){
        req.flash('error', 'you dont have permission to update this campground');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}
router.get('/', catchAsync(async (req, res) => {
    try {
        const data = await Campground.find({});
        res.render('campground/index', { data });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
}));

router.get('/new',isLoggedIn, (req, res) => {
    if(!req.isAuthenticated()){
        req.flash('error','you must  be logged in');
        res.redirect('/login');
    }
    res.render('campground/new');
});

router.post('/',isLoggedIn,upload.array('Image'),validateCampground, catchAsync(async (req, res) => {
    
        const campground = new Campground(req.body.Campground);
        campground.Image = req.files.map(f => ({ url: f.path, filename: f.filename }));
        campground.author = req.user._id;
        await campground.save();
        console.log(campground);
        req.flash('success', 'Successfully made a new campground!');
        res.redirect(`/campgrounds/${campground._id}`);
   
}));
// router.post('/', upload.array('Image'), async (req, res, next) => {
//         console.log(req.file);
//         res.send("it worked!");
// });

router.get('/:id/edit',isLoggedIn,isAuthors, catchAsync(async (req, res) => {
    
        const { id } = req.params;
        const data = await Campground.findById(id);
        if (!data) {
            req.flash('error', 'Cannot find that campground!');
            return res.redirect('/campgrounds');
        }
       // console.log(data);
      
        
        res.render('campground/edit', { data });
    
}));

router.get('/:id',isLoggedIn, catchAsync(async (req, res) => {
    
        const { id } = req.params;
        const data = await Campground.findById(req.params.id).populate({
            path: 'reviews',
            populate: {
                path: 'author'
            }
        }).populate('author');
        if (!data) {
            req.flash('error', 'Cannot find that campground!');
            return res.redirect('/campgrounds');
        }
        
        res.render('campground/show', { data });
   
}));

router.put('/:id',isLoggedIn,isAuthors,upload.array('Image'), catchAsync(async (req, res) => {
    
        const { id } = req.params;
        
        const data1 = await Campground.findByIdAndUpdate(id, { ...req.body.Campground }, { new: true });
        const imgs=req.files.map(f => ({ url: f.path, filename: f.filename }));
        data1.Image.push(...imgs);
        await data1.save();
        if (req.body.deleteImages) {
            for (let filename of req.body.deleteImages) {
                await cloudinary.uploader.destroy(filename);
            }
            await data1.updateOne({ $pull: { Image: { filename: { $in: req.body.deleteImages } } } })
        }
        req.flash('success', 'Successfully updated campground!');
        res.redirect(`/campgrounds/${data1._id}`);
   
}));

router.delete('/:id',isLoggedIn, catchAsync(async (req, res) => {
    
        const { id } = req.params;
        await Campground.findByIdAndDelete(id);
        req.flash('success', 'Successfully deleted campground')
        res.redirect('/campgrounds');
    
}));

module.exports = router;
