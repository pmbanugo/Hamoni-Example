$(document).ready(function() {
  let username = null; //the identity of the user who logged in and wants to use the application
  let friend = null; //the identity of the person the logged in user wants to chat with
  const appId = "YOUR_APPID"; //this is what identifies your application. For now you can use the email you subscribed with

  while (!username) {
    getUserName();
  }

  let hamoni = new Hamoni(appId, username); //initialise Hamoni
  let userToUserConnection = null;

  hamoni.ready(() => {
    while (!friend) {
      getFriendName();
    }

    hamoni.connectWithUser(friend, chatSetupCompleted, chatSetupFailed); //connectWithUser() establishes a connection with the person the logged in user wants to chat with. Parameters are: the identity of the other user, a function to execute when the connetion is successful, and a function to execute when the connection fails.
  });

  function getUserName() {
    username = prompt("Enter your username");
  }

  function getFriendName() {
    friend = prompt("Enter the name of the user you want to chat with");
  }

  function addMessage(data) {
    let template = $("#new-message").html();
    template = template.replace(
      "{{body}}",
      `<b>${data.user}:</b> ${data.message}`
    );

    $(".chat").append(template);
  }

  function chatSetupCompleted(connection) {
    let template = $("#new-message").html();
    template = template.replace(
      "{{body}}",
      "<b>Chat Setup Completed. Start your conversation!</b>"
    );

    $(".chat").append(template);

    userToUserConnection = connection; //an object that describes the connection betwwen the users
    userToUserConnection.onNewMessage(addMessage); //function to execute when a new message arrives
    activateChatBox();
  }

  function chatSetupFailed() {
    let template = $("#new-message").html();
    template = template.replace(
      "{{body}}",
      "<b>Chat Setup Failed. Contact Admin.</b>"
    );

    $(".chat").append(template);
  }

  function activateChatBox() {
    $("#message").removeAttr("disabled");
    $("#btn-chat").click(function() {
      const message = $("#message").val();
      $("#message").val("");

      //send message
      userToUserConnection.send(message);
    });

    $("#message").on("keydown", function(e) {
      if (e.keyCode === 13) {
        $("#btn-chat").click();
      }
    });
  }
});
