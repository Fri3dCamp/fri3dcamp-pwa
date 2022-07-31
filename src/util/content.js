const charMap = {
	"&#8209;": "\u2011",
	"&#8210;": "\u2012",
	"&#8211;": "\u2013",
	"&#8212;": "\u2014",
	"&#8213;": "\u2015",
	"&#8214;": "\u2016",
	"&#8215;": "\u2017",
	"&#8216;": "\u2018",
	"&#8217;": "\u2019",
	"&#8218;": "\u201A",
	"&#8219;": "\u201B",
	"&#8220;": "\u201C",
	"&#8221;": "\u201D",
};

var charRegexp = new RegExp(Object.keys(charMap).join("|"), "gi");

export function unEscape(input) {
	return input.replace(charRegexp, function (matched) {
		return charMap[matched];
	});
}

export function autoP(input) {
	var parts = input.split("\n");

	// rejoin with paragraph tags
	var doc = parts.join("</p><p>");

	// wrap the entire thing in open/close paragraphs
	return "<p>" + doc + "</p>";
}
