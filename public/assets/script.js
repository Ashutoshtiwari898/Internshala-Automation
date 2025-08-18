function test() {
  var tabs = $("#navbarSupportedContent");
  var activeItem = tabs.find(".active");
  var activeHeight = activeItem.innerHeight();
  var activeWidth = activeItem.innerWidth();
  var itemPos = activeItem.position();
  $(".hori-selector").css({
    top: itemPos.top + "px",
    left: itemPos.left + "px",
    height: activeHeight + "px",
    width: activeWidth + "px",
  });
}
$(document).ready(function () {
  setTimeout(test, 100);
});
$(window).on("resize", function () {
  setTimeout(test, 500);
});
$(".navbar-toggler").click(function () {
  $(".navbar-collapse").slideToggle(300);
  setTimeout(test, 300);
});
