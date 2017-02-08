<div class="swiper-wrapper">
	{{#each this}}
	<div class='swiper-slide'>
		<img src="http://121.42.167.167:8080{{this}}" alt="" />
	</div>
	{{/each}}
</div>
<!-- Add Pagination -->
<div class="swiper-pagination"></div>
<!--div class="num">
	<ul>
	{{#each this}}
	<li>{{@index}}</li>
	{{/each}}
	</ul>
</div-->