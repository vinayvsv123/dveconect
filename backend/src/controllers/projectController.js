import Project from '../models/project.model.js';
import User from '../models/user.model.js';

export const createproject=async(req,res)=>{
    try{
        const {title,description,skills}=req.body;
        if(!title||!description||!skills)
        {
            return res.status(400).json({message:"All fields are required"});
        }
        const newProject=new Project({
            title,
            description,
            skills,
            postedBy:req.user.userId,
        });
        await newProject.save();
        res.status(201).json({message:"Project created successfully",project:newProject});
    }
    catch(error)
    {
        res.status(500).json({message:"Server error"});
    }

};



export const getAllProjects = async (req, res) => {
     try
       {
          const projects = await Project.find().populate('postedBy', 'username');
          res.status(200).json(projects);
        } 
    catch (error) 
      {
            res.status(500).json({ message: 'Server error' });
        }
};


export const getProjectById = async (req, res) => {
  try {
      const project = await Project.findById(req.params.id).populate('postedBy', 'username');
      if (!project) 
        {
        return res.status(404).json({ message: 'Project not found' });
        }
      res.status(200).json(project);
    }  
    catch (error)
     {
            console.error("Error fetching project:", error);
            res.status(500).json({ message: 'Server error' });
     }
};

