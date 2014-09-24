require File.expand_path('../boot', __FILE__)

# Pick the frameworks you want:
require "active_record/railtie"
require "action_controller/railtie"
require "action_mailer/railtie"
require "sprockets/railtie"
# require "rails/test_unit/railtie"

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(:default, Rails.env)

module Wavpool
  class Application < Rails::Application
    # config.paperclip_defaults = {
    #   storage:              :s3,
    #   s3_protocol:          'http',
    #   url:                  ':s3_domain_url',
    #   path:                 "images/:class/:id.:style.:extension",
    #   s3_host_name:         's3-us-west-1.amazonaws.com',
    #   s3_credentials:       { access_key_id:     ENV["AWS_ACCESS_KEY_ID"],
    #                           secret_access_key: ENV["AWS_SECRET_ACCESS_KEY"],
    #                           bucket:            ENV['S3_BUCKET'] },
    # }
  end
end
