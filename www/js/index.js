window.onload = function () {
	if (!window.showInfo) {
		if (localStorage.getItem("butterFly")) {
			location.replace("check.html");
		} else {
			location.replace("game.html");
		}
	}
};
