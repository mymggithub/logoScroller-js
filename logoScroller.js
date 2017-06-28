// JavaScript Document

var maxSec = 2;
var currentSec = 0;
var total = 0;
var currentPanel = 1;
var autoPlay = true;
var mainWidth,mainHeight;

$(function(){
	$(".scroller").show();
	$(".scroller_bar").show();
	mainWidth = $('.scroller').width();
	mainHeight = $('.scroller').height();
	setInterval(autoAdvance, 1000);

	$('.scroller').hover(
		function(){
			autoPlay = false;
			$(this).removeClass('autoplay');
		},
		function(){
			autoPlay = true;
			currentSec = 0;
			$(this).addClass('autoplay');
		}
	);

	loadImgs();

	loadNav();
});

function autoAdvance(){
	if (currentSec == maxSec){
		currentSec = 0;
		if (autoPlay == true){
			if(currentPanel == total){
				$('.scroller_nav a.scroller_nav_item:nth-child(1)').trigger('click');
			}else{
				$('.scroller_nav a.scroller_nav_item:nth-child('+(currentPanel+1)+')').trigger('click');
			}
		}
	}else{
		currentSec += 1;
	}
}

function setCaption(){
	var barTop = $('.scroller').height() - $('.scroller_bar').height() - 15;
	$('.scroller_bar').delay(100).animate({top: barTop}, 500);
}
function loadImgs(){
	// Preload pics, then initialize
	$('.scroller_panels img').imgpreload(function(){
		$('.scroller_caption').html(
			$('.scroller_panels li:first .panel_caption, .scroller_panel .panel_caption').html()
		);
		$('.scroller_nav a.scroller_nav_item:first').addClass('selected');
		$('.scroller_pics').fadeIn(1500);
		setCaption();
	});
	// photo line
	$('.scroller_panels li>img, img.scroller_panel_pic').each(function(index){
		//var mainWidth = $('.scroller').width();
		//var picPos = index * mainWidth;
		$('.scroller_pics').append(
			$("<img>",{
				class:"scroller_pic",
				src:$(this).attr('src'),
				alt:$(this).attr('alt'),
				width:mainWidth,
				height:mainHeight
			})
		);//style="left:'+picPos+'px"
		//$('.scroller_pics').css('width', picPos+mainWidth);
	});

	// Duplicate first and last to create a smoth line up
	$('.scroller_pics img:last-child').clone().insertBefore('.scroller_pics img:first-child');
	$('.scroller_pics img:nth-child(2)').clone().insertAfter('.scroller_pics img:last-child');

	// Reposition the pics
	$('.scroller_pics img').each(function(index){
		var picPos = index * mainWidth;
		$(this).css('left',picPos+'px');
		$('.scroller_pics').css('width',picPos+mainWidth+'px');
	});

	// position second photo as first
	$('.scroller_pics').css('left','-'+mainWidth+'px');
}
function loadNav(){
	// nav link generator
	$('.scroller_panels li, .scroller_panel').each(function(index){
		$('.scroller_nav').append($("<a>",{class:"scroller_nav_item"}));
		total = index + 1;
	});
	// nav set up
	$('.scroller_nav a.scroller_nav_item').click(function(){
		$('.scroller_nav a.scroller_nav_item').removeClass('selected');$(this).addClass('selected');

		var navClicked = $(this).index();
		var distanceToMove = mainWidth*(-1);
		var newPicPos = navClicked*distanceToMove-mainWidth + 'px';
		var newCaption = $('.panel_caption').get(navClicked);

		picAnim(navClicked,newPicPos);

		// Animate caption
		$('.scroller_bar').animate({top: '340px'}, 500, function(){
			$('.scroller_caption').html($(newCaption).html());
			setCaption();
		});
	});
}
function picAnim(navClicked,newPicPos){
	// Animate photos
	if(currentPanel == total && navClicked == 0){
		newPicPos = (mainWidth*(total+1)*-1)+'px';
		$('.scroller_pics').animate({left: newPicPos}, 1000, function(){
			$('.scroller_pics').css('left','-'+mainWidth+'px');
		});
	}else if(currentPanel == 1 && navClicked == (total-1)){
		newPicPos = '0px';
		$('.scroller_pics').animate({left: newPicPos}, 1000, function(){
			$('.scroller_pics').css('left','-'+(mainWidth*total)+'px');
		});
	}else{
		$('.scroller_pics').animate({left: newPicPos}, 1000);
	}
	currentPanel = navClicked + 1;
}