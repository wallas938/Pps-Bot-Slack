import { App } from "@slack/bolt";
import _APIs from "./api/allAPI";
import * as express from "express";

require("dotenv").config();
const server = express();
const bodyParser = require("body-parser");
const config = process.env;
const BOT_USER_OAUTH_ACCESS = config.BotUserOAuthAccess;
const SLACK_SIGNING_SECRET = config.Slack_Signing_Secret;
const bot_PORT = config.bot_PORT || 3000;
const SERVER_PORT = config.SERVER_PORT || 8080;
server.use(bodyParser.json());
server.use(
  bodyParser.urlencoded({
    extended: true
  })
);

const projectAPI = new _APIs.ProjectAPI();
const assessmentAPI = new _APIs.AssessmentAPI();

var allProjects: any[];
var allAssessments: any[];

const bot = new App({
  token: BOT_USER_OAUTH_ACCESS,

  signingSecret: SLACK_SIGNING_SECRET
});

async function getAllProjects() {
  return await projectAPI.getProjects();
}

async function getOneProject(projectId: any) {
  return await projectAPI.getProject(projectId);
}

async function getAllProjectsByTags(tags: string[]) {
  return await projectAPI.getProjectsByTags(tags);
}

async function getAllAssessments() {
    return await assessmentAPI.getAssessments();
}
  
async function getOneAssessment(assessmentId: any) {
    return await assessmentAPI.getAssessment(assessmentId);
}

async function getAllAssessmentsByTags(tags: string[]) {
  return await assessmentAPI.getAssessmentsByTags(tags);
}

/* async function getProjectsFromTags(tags: string[]) {
  return await projectAPI.getProjectsByTags(tags);
}

async function getProjectsFromTagsByTypes(tags: string[], types: string[]) {
  return await projectAPI.getProjectsByTagsByTypes(tags, types);
} */

(async () => {
    try {
        /**** Get All or one specific project by id ****/
        await bot.start(bot_PORT);

        console.log("Bot connected on: " + bot_PORT);
      } catch (e) {
        console.log(`Error : ${e}`);
        // Deal with the fact the chain failed
      }
})();

bot.error((error: any) => {
  // Check the details of the error to handle special cases (such as stopping the app or retrying the sending of a message)
  console.error(error);
});

// Commands handlers

/* command /pulse */
bot.command("/pulse", async ({ command, ack, say }: any) => {


    if(command.text !== "") {
      const res = command.text.split(" ");

      if(res[0] === "assessment" && 
        res[1] === "status"        && 
        res[2] === "tags"           &&
        res[3] != null) {

          let tags = [res[3]];

          console.log(tags)
          console.log("enter")

          try {

            let oneMatchAtLeast = false;
            let commandResponse = {
              name: "",
              tags: "",
              assessmentType: "",
              status: "",
              date: "0",
            }

            var options = { 
              year: 'numeric', month: "2-digit", 
              day: "2-digit", hour: "2-digit", 
              minute: "2-digit", second: "2-digit" 
            };
            const assessList = await getAllAssessmentsByTags(tags);
            const projectList = await getAllProjectsByTags(tags);
            assessList.assessments.forEach((assessment: any) => {
              projectList.projects.forEach((project: any) => {

                
                  if(assessment.projectId === project.id) {
                    oneMatchAtLeast = true;

                    commandResponse.name = project.name;
                    commandResponse.tags = project.tags.join('/')
                    commandResponse.status = assessment.status
                    commandResponse.assessmentType = assessment.assessmentType

                    let currentAssessDate = new Date(`${assessment.date}`).toLocaleString("en-GB", options);
                    
                    if(commandResponse.date <  currentAssessDate) {

                      commandResponse.date = currentAssessDate
                    } 
                  }
              });
            });

            if(!oneMatchAtLeast) {
              return ack({
                "error": `no matching projects`,
                "message": `no assessments were made with tag: ${tags.join()}`
              });
            } else {
              ack();
              return say(
                `Project Name: ${commandResponse.name}
                Tags: ${commandResponse.tags}
                AssessmentType: ${commandResponse.assessmentType}
                Assessment status: ${commandResponse.status}
                Last Assessment: ${commandResponse.date}`)
            }
            
          } catch (error) {
                  
            console.log(error.body)

          }

        } else {
          ack({  "name": `empty tag`,
                  "error": `no tag was entered` });

          return say(`Please enter a proper tag`);
        }
    } else {
      ack({  "name": `empty command`,
              "error": `no command was entered` });

      return say(`Please enter a command on this format: /pulse | assessement | status | tags <your tag>`);
    }
})
/* 
        for(let i = 0; i<allProjects.length; i++) {
            if(allProjects[i].name.toLowerCase().includes(command.text.toLowerCase())) {

                ack();

                return say(`Result of your query =>   
                                Name: ${allProjects[i].name}, 
                                Types: ${allProjects[i].types.join('/')}, 
                                ID: ${allProjects[i].id},
                                Tags: ${  allProjects[i].tags.length > 0 ? 
                                            allProjects[i].tags.join('/') : 
                                            "As of yet no tags exist for this project"}`);
            }
        }
        
        ack({
            "name": "project_query",
            "error": `No project with the following name: ${command.text}`
        });

        return say(`Please enter your query`);
    } else {
        
    }
 
}); */

//Reagi a la premiere connexion
bot.event("app_home_opened", async ({ event, say }: any) => {

    say(`Hello world, <@${event.user}>!`);
});

//Reagi a l'arrivé d'un membre dans le groupe
bot.event("member_joined_channel", ({ event, say }: any) => {
  say(`Hello world, <@${event.user}>!`);
});

//Reagi a un n'importe quel message qui inclu le mot "vert"
bot.message("salut", async ({ message, say }: any) => {
  console.log(message.text);
  say(`Salut à toi , <@${await message.user}>!`);
});

// Events url initializer

server.post("/slack/events", (req: any, res: any, next: any) => {
  const challenge = req.body.challenge;
  console.log(req.body);
  res.status(200)
      .contentType("text/plain")
      .send({ challenge });
});

server.listen(SERVER_PORT, () =>
  console.log(`server running on port: ${SERVER_PORT}`)
);
