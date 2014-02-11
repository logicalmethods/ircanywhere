App.NetworkController = Ember.ObjectController.extend({
	needs: ['index', 'messages'],

	tabChanged: function() {
		var tab = this.get('socket.tabs').findBy('_id', this.get('controllers.index.tabId'));
		// get the selected tab

		if (tab) {
			var network = this.get('socket.networks').findBy('_id', tab.get('network'));

			delete tab.selectedTab;
			// delete this because it'll cause a circular reference

			network.set('selectedTab', tab);
			this.set('content', network);
			// set content.selectedTab (network) - so we can find the full selected tab object in
			// the network's object for quick access
		}
		// update this.tab if we have a new selected tab
	}.observes('controllers.index.tabId', 'socket.tabs.@each.selected'),

	markAllAsRead: function(id) {
		var tab = this.get('socket.tabs').findBy('_id', id);

		if (!tab) {
			return false;
		}
		// some how this has happened, but lets be safe and not continue anyway

		var network = this.get('socket.networks').findBy('_id', tab.get('network'));

		if (tab.type === 'network') {
			var query = {network: tab.networkName, read: false, target: '*'};
		} else if (tab.type === 'query') {
			var query = {network: tab.networkName, read: false, $or: [{target: tab.target}, {'message.nickname': tab.target, target: network.nick}]};
		} else if (tab.type === 'channel') {
			var query = {network: tab.networkName, read: false, target: tab.target};
		}

		var events = this.get('controllers.messages.sorted').filterProperty('unread', true);
		// get the events for the specific tab

		events.setEach('unread', false);
		tab.set('unread', 0);
		// mark them as unread to hide the bar

		this.socket.update('events', query, {read: true});
		// update the records
	},

	gotoUnread: function(id) {
		var first = this.get('controllers.messages.sorted').filterProperty('unread', true).objectAt(0),
			tabElement = Ember.$('#tab-' + this.get('controllers.index.tabId') + ' .backlog');

		if (first) {
			var firstElement = tabElement.find('[data-id=' + first._id + ']')[0];
			tabElement[0].scrollTop = firstElement.offsetTop - firstElement.offsetHeight;
		} else {
			tabElement[0].scrollTop = 0;
		}
		// XXX - Work on this.. A bit iffy
	},

	gotoHighlight: function(id) {
		console.log('goto first highlight');
		// XXX
	},

	ready: function() {
		this.tabChanged();
	}
});