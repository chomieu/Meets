var feedback = function(res) {
  if (res.success) {
    var imgUrl = res.data.link
    $("#pfp").html(`<p>${imgUrl}</p> <img src="${imgUrl}">`)
  }
}

new Imgur({
  clientid: 'dedf89882fddbf0',
  callback: feedback
})