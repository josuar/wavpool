class Api::FeedsController < ApplicationController
  before_action :require_authenticated!
  
  def show
    @feed = current_user.feed
  end
end
