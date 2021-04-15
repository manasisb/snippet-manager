const router = require('express').Router();
// const SnippetModel = require('../models/snippet_model');
const Snippet = require('../models/snippet_model');
const auth = require('../middleware/auth');

router.get("/", auth, async (req,res) => {
    try{

        //const token = req.cookies.token;
        // console.log(req.user);

        const snip = await Snippet.find({user:req.user})
        res.json(snip);
    }catch(err){
        res.status(500).send();
    }
});

//post request using router
router.post("/",auth,async (req,res) => {
    try{
    // const {name, lname, code} = req.body;
    // console.log(req.body);
        const {title, description, code} = req.body;
        if(!description && !code){
            return res.status(400).json({errMessage : "You need to display atleast description or code"});
        }
        const newSnippet = new Snippet({
            title, 
            description, 
            code, 
            user: req.user,
        });
        savedSnippet = await newSnippet.save();
        res.json(savedSnippet)
    }catch(err){
        res.status(500).send("Internal Server Error");
    }
});

router.put("/:id", auth, async(req, res) => {
    try{
        const {title, description, code} = req.body;
        if(!description && !code){
            return res.status(400).json({errMessage : "You need to display atleast description or code"});
        }

        const snippetID = req.params.id;
        if(!snippetID){
            return res.status(400).json({errMessage : "Snippet ID not found. Please contact developer"});
        }

        const originalSnippet = await Snippet.findById(snippetID);
        if(!originalSnippet){
            return res.status(400).json({errMessage : "Snippet not found. Please contact developer"});
        }

        if(originalSnippet.user.toString() !== req.user){
            return res.status(401).json({errMessage : "Unauthorized."});
        }

        originalSnippet.title = title;
        originalSnippet.description = description;
        originalSnippet.code = code;

        const savedSnippet = await originalSnippet.save();

        res.send(savedSnippet);
    }catch(err){
        res.status(500).send("Internal Server Error");
    }
})

router.delete("/:id", auth, async(req,res) => {
    try{
        const snippetID = req.params.id;
        // validation
        if(!snippetID){
            return res.status(400).json({errMessage : "Snippet ID not found. Please contact developer"});
        }
        const snippetTobeDeleted = await Snippet.findById(snippetID);
        if(!snippetTobeDeleted){
            return res.status(400).json({errMessage : "Snippet not found. Please contact developer"});
        }

        if(snippetTobeDeleted.user.toString() !== req.user){
            return res.status(401).json({errMessage : "Unauthorized."});
        }

        await snippetTobeDeleted.delete();
        res.send(snippetTobeDeleted);
}catch(err){
    res.status(500).send("Internal Server Error");
}

})





module.exports = router;
