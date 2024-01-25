/* global jsyaml */

let story;

function startStory(text) {

  story = jsyaml.load(text);
  
  // TODO: replace this placeholder text with details from `story`
  let title = story.Title;
  
  let initialScene = story.Start;
  
  return {title, initialScene};
}

function startScene(sceneName) {
  
  let scene = story.Scenes[sceneName];
  // TODO: replace this placeholder text with details from `story`, specific for scene `sceneName`
  let imageUrl = story.Scenes[sceneName].url;
  let caption = story.Scenes[sceneName].cap;
  let choices = []
  for (let i of story.Scenes[sceneName].opts){
    console.log(i);
    choices.push(
      {
        text: i.text,
        target: i.point
      }
    )
  }
  
  return {imageUrl, caption, choices};
}
