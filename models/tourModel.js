const mongose = require('mongoose');
const slugify = require('slugify');
// const validator = require('validator');

const tourSchema = new mongose.Schema(
    {
        name: {
            type: String,
            required: [true, 'A tour must have a name'], // its validator
            unique: true, // its technically not a validator
            trim: true,
            maxlength: [40, 'A tour name must have less or equal then 40 characters'], // its validator
            minlength: [10, 'A tour name must have more or equal then 10 characters'], // its validator
            // validate: [validator.isAlpha, 'Tour name must only contain character']
        },
        slug: String,
        duration: {
            type: Number,
            required: [true, 'A tour must have a A tour must have a duration']
        },
        maxGroupSize: {
            type: Number,
            required: [true, 'A tour must have a group size']
        },
        difficulty: {
            type: String,
            required: [true, 'A tour must have a difficult'],
            enum: {
                values: ['easy', 'medium', 'difficult'],
                message: 'Difficulty is either: easy, medium, difficult'
            }
        },
        ratingsAverage: {
            type: Number,
            default: 4.5,
            min: [1, 'Rating must be above 1.0'], // its validator
            max: [5, 'Rating must be below 5.0']  // its validator
        },
        ratingsQuantity: {
            type: Number,
            default: 0
        },
        price: {
            type: Number,
            required: [true, 'A tour must have a price']
        },
        priceDiscount: {
            type: Number,
            validate: {
                validator: function (val) {
                    // this only points to current doc on NEW docunebt creation //! So Don't work with Update
                    return val < this.price; // 100 < 200 --> True,   250 < 200 --> False
                },
                message: 'Discount price ({VALUE}) should be below regular price'

            }
        },
        summary: {
            type: String,
            trim: true,
            required: [true, 'A tour must have a summary']
        },
        description: {
            type: String,
            trim: true
        },
        imageCover: {
            type: String,
            required: [true, 'A tour must have a cover image']
        },
        images: [String],
        createdAt: {
            type: Date,
            default: Date.now(),
            select: false
        },
        startDates: [Date],
        secretTour: {
            type: Boolean,
            default: false
        }
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

tourSchema.virtual('durationWeeks').get(function () {
    return this.duration / 7;
});

// DOCUMENT MIDDLEWARE: runs before .save() and .create() //! Not with .insertMany() | .find | .findAndUpdate | ...
tourSchema.pre('save', function (next) {
    this.slug = slugify(this.name, { lower: true }); // this is return to current document
    next();
});

// tourSchema.pre('save', function (next) {
//     console.log("Will save document...");
//     next();
// });

// tourSchema.post('save', function (doc, next) {
//     console.log(doc);
//     next();
// });

// QUERY MIDDLEWARE
tourSchema.pre(/^find/, function (next) {
    // tourSchema.pre('find', function (next) {
    console.log("Bdfore 1.1")
    this.start = Date.now();
    this.find({ secretTour: { $ne: true } });
    next();
});

tourSchema.post(/^find/, function (docs, next) {
    console.log("After  1.2")
    console.log(`Query took ${Date.now() - this.start} millesconds`);
    // console.log(docs);
    next();
});

// AGGREGATION MIDDLEWARE
tourSchema.pre('aggregate', function (next) {
    this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });// unshift to insert at begining of array

    console.log(this.pipeline()); // this is return to current aggregate object
    next();
});

const Tour = mongose.model('Tour', tourSchema);

module.exports = Tour;
