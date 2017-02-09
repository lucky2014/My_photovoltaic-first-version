<span class="pwsText"><em id="defaultStation"></em><i></i></span>
<ul class="level1 hide">
    {{#each this}}
    <li stationId="{{id}}">
        <span>{{name}}</span>
        <ul class="level2 hide">
            {{#each childList}}
            <li stationId="{{id}}">{{name}}</li>
            {{/each}}
        </ul>
    </li>
    {{/each}}
</ul>