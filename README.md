image-tags
=====

A configurable jQuery plugin that allows you to tag images and so on.

##  Installation

**Using npm:**

```
npm install image-tags
```

**Manually:**
Simply download `jquey.tags.js` from this repo and add it to your HTML. e.g.


Then include it after your jQuery file.

	<script src="js/jquery.js"></script>
	<script src="./js/jquery.tags.js"></script>

Optionally you can use include the css file as well.

	<link href="css/tags.css" />

## 2. Configuration

	var options = {

		// Aligning the text
		align: {
			x: 'center', // left, center or right
			y: 'center'	// top,	center or bottom
		},


		// The (relative) offset of the popups in pixels
		offset: {
			left: -15, // horizontal offset
			top: 20	// vertical offset
		},


		// event handlers of the tags
		handlers: {
			click: function(e) {
				alert('You clicked a button');
				this; // the DOM Node
				e;	// the Event
			},
			// Use 'show', 'hide' and 'toggle' to show/hide popups on mouse actions.
			mouseenter: 'show', # Displays popup on mouseenter.
			mouseleave: 'hide'  # Hides popup on mouseleave.
		}

		// Whether to enable editor mode
		edit: false,
		
		// vote mode 
		//first edit:false must be false
		//then 
		tagsType: 'radio', 
        radioBaseSize: 24,
		// Strings for buttons
		strings: {
			save: '&#x2713;',
			delete: '&#x00D7;'
			addLink: '&#64;'
		}
	};


	// The magic comes together here
	$('.taggd').taggd( options, data );

## 3. What is “data” and how do I get it?

Data are the tags. Taggd accepts different formats, so pay close attention!

	var data = [
		// x and y values can be decimals (0-1)
		{
			x: 0.5,
			y: 0.33,
			text: 'test',
			attributes: {
				id:    'my-id',
				class: 'my-class'
			}
		},
		
		//vote mode
		{
			x: 0.5,
			y: 0.33,
			percent:0.6
			text: 'iphone',
		},
		{
			x: 0.15,
			y: 0.8,
			percent:0.4
			text: 'android',
		},
		
		//link
		
		{
			x: 0.15,
			y: 0.8,
			link: 'http://gold.xitu.io/#/'
		},
	];	