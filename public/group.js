$(document).ready(function() {
  let username = null; //the identity of the user who logged in and wants to use the application
  let friend = null; //the identity of the person the logged in user wants to chat with
  const appId = "ab5daa7fdfe86f5cd47d6b582938dd60"; //this is what identifies your application. For now you can use the email you subscribed with
  let selectedGroup = null;
  let group = null;

  getUserName();

  function getUserName() {
    $("#usernameModal").modal({ backdrop: "static", keyboard: false });
    $("#usernameForm").submit(function(event) {
      event.preventDefault();
      username = $("#username").val();
      if (username) {
        $("#usernameModal").modal("hide");
        initialiseHamoni();
      }
    });
  }

  function initialiseHamoni() {
    let hamoni = new Hamoni(appId, username); //initialise Hamoni

    hamoni.ready(async () => {
      let groups = await hamoni.getGroups();
      $("#groupModal").modal({ backdrop: "static", keyboard: false });
      groups.forEach(group => {
        $("#group").append(
          new Option(group.displayName, group.name, false, false)
        );
      });

      $("#groupForm").submit(function(event) {
        event.preventDefault();
        selectedGroup = $("#group").val();
        if (selectedGroup) {
          $("#groupModal").modal("hide");

          $(".chat").html("");

          console.log("calling join group");

          hamoni.joinGroup(
            selectedGroup,
            groupInstance => {
              if (!group) {
                group = groupInstance;
                chatSetupCompleted();
              } else {
                group = groupInstance;
                subscribeToEvents();
              }

              console.log("selected group is");
              console.log(group);
            },
            reason => chatSetupFailed(reason)
          );
        }
      });
    });
  }

  $("#leaveGroup").click(function(event) {
    console.log("calling leave group");

    group.leaveGroup(
      () =>
        $("#groupModal").modal({
          backdrop: "static",
          keyboard: false
        }),
      error => console.log(error)
    );
  });

  function addMessage(data) {
    if (data.group === selectedGroup) {
      let template = $("#new-message").html();
      template = template.replace(
        "{{body}}",
        `<b>${data.user}:</b> ${data.message}`
      );

      $(".chat").append(template);

      $("#panel-body").scrollTop($("#panel-body")[0].scrollHeight);
    }
  }

  function subscribeToEvents() {
    group.onNewMessage(addMessage);

    group.onNewMember(member => {
      let template = $("#new-message").html();
      template = template.replace(
        "{{body}}",
        `<b>Group Info:</b> ${member} has joined the group`
      );

      $(".chat").append(template);
    });

    group.onMemberLeft(member => {
      let template = $("#new-message").html();
      template = template.replace(
        "{{body}}",
        `<b>Group Info:</b> ${member} has left the group`
      );

      $(".chat").append(template);
    });

    $("#groupMemberseModal").on("show.bs.modal", function(e) {
      console.log("getting memebers");
      group
        .getMembers()
        .then(members => {
          console.log("members are: ");
          console.log(members);

          $("#groupMemberList").html("");
          members.forEach(member => {
            $("#groupMemberList").append(
              `<li class="list-group-item">${member}</li>`
            );
          });
        })
        .catch(error => console.log("error occured") || console.log(error));
    });
  }

  function chatSetupCompleted() {
    let template = $("#new-message").html();
    template = template.replace(
      "{{body}}",
      "<b>Chat Setup Completed. Start your conversation!</b>"
    );

    $(".chat").append(template);
    subscribeToEvents();
    activateChatBox();
  }

  function chatSetupFailed(failureReason) {
    console.log(`failed to join group because ${reason}`);

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

      console.log("send is using group");
      console.log(group);

      //send message
      group.send(message);
    });

    $("#message").on("keydown", function(e) {
      if (e.keyCode === 13) {
        $("#btn-chat").click();
      }
    });
  }
});
