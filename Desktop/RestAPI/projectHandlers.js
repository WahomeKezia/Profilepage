const Project = require('./db/projectModel');

module.exports = {
  createProject: async (request, response) => {
    try {
      // create a new project instance and collect the data
      const project = new Project({
        projectname: request.body.projectname,
        teamlead: request.body.teamlead,
        members: request.body.members,
        datestarted: request.body.datestarted,
        tool: request.body.tool
      });

      // save the new project
      const result = await project.save();

      // return success if the new project is added to the database successfully
      response.status(201).send({
        message: "Project created successfully",
        result,
      });
    } catch (error) {
      // catch any errors that may have occurred when saving the project
      console.error(error);
      response.status(500).send({
        message: "Error creating project",
        error,
      });
    }
  },
  updateProject: async (request, response) => {
    try {
      // find the project to update
      const project = await Project.findById(request.params.id);

      // update the project with the new data
      project.projectname = request.body.projectname;
      project.teamlead = request.body.teamlead;
      project.members = request.body.members;
      project.datestarted = request.body.datestarted;
      project.tool = request.body.tool;

      // save the updated project
      const result = await project.save();

      // return success if the project was updated successfully
      response.status(200).send({
        message: "Project updated successfully",
        result,
      });
    } catch (error) {
      // catch any errors that may have occurred when updating the project
      console.error(error);
      response.status(500).send({
        message: "Error updating project",
        error,
      });
    }
  }
}
