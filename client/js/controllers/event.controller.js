App.EventController = Ember.ObjectController.extend({
	needs: ['tab', 'network'],
	blacklisted: [],
	
	classNames: function() {
		var type = this.get('content.type'),
			hideEvents = this.get('controllers.tab.model.hiddenEvents'),
			hide = (hideEvents && (type === 'join' || type === 'part' || type === 'quit')) ? ' hide' : '';

		return (type === 'privmsg' || type === 'action') ? 'row' + hide : 'row other' + hide;
	}.property('content.type', 'controllers.tab.model.hiddenEvents').cacheable(),

	templateName: function() {
		var content = this.get('content'),
			type = content.type;

		if (type !== 'unknown' || (type === 'unknown' && this.blacklisted.indexOf(content.message.command) === -1)) {
			return 'events/' + type;
		} else {
			return false;
		}
	}.property('content.type').cacheable()
});