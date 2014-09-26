class Api::FollowsController < ApplicationController
  before_action :prevent_user_following_self
  
  def create
    @follow = this_user.in_follows.create(follower: current_user)
    
    render json: @follow
  end
  
  def destroy
    follow = this_user.in_follows.find_by_follower_id(current_user.id)
    
    follow.destroy
    
    render json: []
  end
  
  private
  
  def this_user
    @this_user ||= User.find(params[:profile_id])
  end
  
  def prevent_user_following_self
    if this_user == current_user
      render json: ["You can't perform that action on yourself."],
        status: :unprocessable_entity
    end
  end
end
