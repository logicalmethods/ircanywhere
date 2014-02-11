App.UserlistController = Ember.ArrayController.extend({
	needs: ['index', 'network', 'tab'],

	owners: Ember.computed.filterBy('filtered', 'sort', 1),
	admins: Ember.computed.filterBy('filtered', 'sort', 2),
	operators: Ember.computed.filterBy('filtered', 'sort', 3),
	halfops: Ember.computed.filterBy('filtered', 'sort', 4),
	voiced: Ember.computed.filterBy('filtered', 'sort', 5),
	normal: Ember.computed.filterBy('filtered', 'sort', 6),

	displayHeading: function() {
		return (this.get('filtered.length') !== this.get('normal.length'));
	}.property('filtered.length', 'normal.length'),

	filtered: Ember.arrayComputed('sorted', 'controllers.index.tabId', {
		addedItem: function(accum, item) {
			var tab = this.get('socket.tabs').filterProperty('_id', this.get('controllers.index.tabId'))[0];

			if (tab && item.network === tab.networkName && item.channel === tab.target) {
				accum.pushObject(item);
			}

			return accum;
		},
		
		removedItem: function(accum, item) {
			var tab = this.get('socket.tabs').filterProperty('_id', this.get('controllers.index.tabId'))[0];

			if (tab && item.network === tab.networkName && item.channel === tab.target) {
				accum.removeObject(item);
			}

			return accum;
		}
	}),

	sorted: function() {
		var results = this.get('channelUsers'),
			sorted = Ember.ArrayProxy.createWithMixins(Ember.SortableMixin, {
				content: results,
				sortProperties: ['sort', 'nickname'],
				sortAscending: true
			});

		return sorted;
	}.property('channelUsers').cacheable(),

	ready: function() {
		this.set('channelUsers', this.socket.channelUsers);
	},
	
	updated: function() {
		this.set('channelUsers', this.socket.channelUsers);
	}
});