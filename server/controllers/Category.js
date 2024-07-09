const Category = require("../models/Category");
function getRandomInt(max) {
    return Math.floor(Math.random() * max)
  }

exports.createCategory = async(req, res) =>{
    try{
        const {name, description} = req.body;
        if(!name || !description){
            return res.status(400).json({
                success:false,
                message:"All fields are required",
            })
        };

        const CategoryDetails = await Category.create({name, description});

        return res.status(200).json({
            success:true,
            message:"Category created successfully",

        });

    }
    catch(error){
        return res.status(500).json({
            success:false,
            message: error.message
        })
    }
};


exports.showAllCategories = async(req, res) =>{
    try{
        const allCategorys = await Category.find({});

        return res.status(200).json({
            success:true,
            message:"All tags returned successfully",
            data:allCategorys,
        });
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message: error.message
        })
    }
};







exports.categoryPageDetails = async(req, res)=>{
    try{
        const {categoryId} = req.body;

        const selectedCategory = await Category.findById(categoryId)
        .populate({
            path: "courses",
            match: { status: "Published" },
          })
             .exec();

        if(!selectedCategory){
            return res.status(404).json({
                success:false,
                message:"Selected  category not found"
            })
        };

       

        // let differentCategory = await Category.findOne({
        //                                  _id: {$ne : categoryId},
        //                                  })
        //                                  .populate({
        //                                     path: "courses",
        //                                     match: { status: "Published" },
        //                                   })
        //                                   .exec()


        const categoriesExceptSelected = await Category.find({
            _id: { $ne: categoryId },
          })
          let differentCategory = await Category.findOne(
            categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]
              ._id
          )
          .populate({
            path: "courses",
            match: { status: "Published" },
          })

         const allCategories = await Category.find()
         .populate({
            path: "courses",
            match: { status: "Published" },
           
            populate: {
              path: "instructor",
          },
          })
         .exec()      

     
         
        const allCourses = allCategories.flatMap((category) => category.courses)
        const mostSellingCourses = allCourses
          .sort((a, b) => b.sold - a.sold)
          .slice(0, 10)
         // console.log("mostSellingCourses COURSE", mostSellingCourses)
        res.status(200).json({
          success: true,
          data: {
            selectedCategory,
            differentCategory,
            mostSellingCourses,
          },
        })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}











