/**
 * Slack Bot Installation Landing Page
 * Displays an "Add to Slack" button for OAuth installation
 */

export default function SlackInstallPage() {
  const appUrl = process.env.APP_URL || process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-indigo-800">
      <div className="bg-white rounded-2xl shadow-2xl p-12 max-w-2xl mx-4">
        <div className="text-center">
          {/* Emoji Icon */}
          <div className="text-7xl mb-6">📅</div>

          {/* Title */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Conferences Calendar Bot
          </h1>

          {/* Description */}
          <p className="text-xl text-gray-600 mb-8">
            Never miss an important conference deadline again!
          </p>

          {/* Features */}
          <div className="text-left mb-10 space-y-3">
            <div className="flex items-start">
              <span className="text-2xl mr-3">🔔</span>
              <div>
                <h3 className="font-semibold text-gray-900">Smart Notifications</h3>
                <p className="text-gray-600">Get reminders 30, 7, and 3 days before deadlines</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-2xl mr-3">🔍</span>
              <div>
                <h3 className="font-semibold text-gray-900">Quick Search</h3>
                <p className="text-gray-600">Search conferences by name or subject area</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-2xl mr-3">⚙️</span>
              <div>
                <h3 className="font-semibold text-gray-900">Customizable</h3>
                <p className="text-gray-600">Filter by subjects (ML, CV, NLP, Security, etc.)</p>
              </div>
            </div>
          </div>

          {/* Add to Slack Button */}
          <div className="mb-6">
            <a
              href={`${appUrl}/api/slack/install`}
              className="inline-block"
            >
              <img
                alt="Add to Slack"
                height="40"
                width="139"
                src="https://platform.slack-edge.com/img/add_to_slack.png"
                srcSet="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x"
              />
            </a>
          </div>

          {/* Commands Preview */}
          <div className="bg-gray-50 rounded-lg p-6 text-left">
            <h3 className="font-semibold text-gray-900 mb-3">Available Commands:</h3>
            <div className="space-y-2 font-mono text-sm">
              <div className="text-gray-700">
                <code className="bg-white px-2 py-1 rounded">/conf-upcoming</code>
                <span className="text-gray-500 ml-2">- Show next 5 deadlines</span>
              </div>
              <div className="text-gray-700">
                <code className="bg-white px-2 py-1 rounded">/conf-search</code>
                <span className="text-gray-500 ml-2">- Search by conference name</span>
              </div>
              <div className="text-gray-700">
                <code className="bg-white px-2 py-1 rounded">/conf-subscribe</code>
                <span className="text-gray-500 ml-2">- Enable notifications</span>
              </div>
              <div className="text-gray-700">
                <code className="bg-white px-2 py-1 rounded">/conf-help</code>
                <span className="text-gray-500 ml-2">- See all commands</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-sm text-gray-500">
            Built for academic researchers and conference attendees
          </div>
        </div>
      </div>
    </div>
  );
}
