const updateUserURL = "/user/id/";
const uploadImageURL = "/user/image/id/";
const viewProfileURL = "/profile?id=";

var updateUser = document.getElementById("update-user");
var userSubmit = document.getElementById("user-submit");
var place;

// user elements
var user;
const userId = window.location.search.split("id=")[1];

getUser(userId).then(function(){

  const userName = document.getElementById('user-name');
  const userEmail = document.getElementById('user-email');
  const userAddress = document.getElementById('maps-autocomplete');

  // get user data
  userName.value = user.name
  userEmail.value = user.email
  if (user.formattedAddress) {
    userAddress.value = user.formattedAddress
  }
});

updateUser.addEventListener('submit', function(){
  event.preventDefault();

  var userId = user._id;

  var userName = document.getElementById("user-name").value;
  var userEmail = document.getElementById("user-email").value;
  var userImage = document.getElementById("user-image").value;
  var userAddress = document.getElementById("maps-autocomplete").value;

  var data = {};
  if (userName) {
    data.name = userName;
  }
  if (userEmail) {
    data.email = userEmail;
  }
  if (userAddress) {
    data.formattedAddress = userAddress;
  }
  if (place) {
    data.longitude = place.geometry.location.lng();
    data.latitude = place.geometry.location.lat();
  }

  // update the user
  $.ajax({
    type: "PUT",
    url: updateUserURL + userId,
    data: data,
    error: function (jXHR, textStatus, errorThrown) {
      alert(errorThrown);
    },
    success: function(user){
      if (userImage) {
        // upload an image if one is attached
        userSubmit.value = 'Uploading...';

        var formData = new FormData();
        formData.append('image',  $('#user-image')[0].files[0]);

        $.ajax({
          url: uploadImageURL + userId,
          type: 'PUT',
          data: formData,
          success:function(data){
            userSubmit.value = 'Done!';
            window.open(viewProfileURL + userId, "_self");
          },
          cache: false,
          contentType: false,
          processData: false
        });
      } else {
        userSubmit.value = 'Done!';
        window.open(viewProfileURL + userId, "_self");
      }
    }
  });
});
