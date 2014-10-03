class Api::FeedsController < ApplicationController
  before_action :require_authenticated!
  
  def show
    @feed = current_user.feed
    
    if (params[:page])
      @feed = @feed.page(params[:page]).per(10)
      render :page
    else
      @feed = @feed.page(1).per(10)
      render :show
    end
  end
end
