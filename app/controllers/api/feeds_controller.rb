class Api::FeedsController < ApplicationController
  before_action :require_authenticated!
  
  def index
    @feed = current_user.feed
  end
end
