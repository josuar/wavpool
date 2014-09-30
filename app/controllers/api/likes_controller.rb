class Api::LikesController < ApplicationController
  def create
    @follow = current_user.out_likes.create(likee: current_submission)
    
    render json: @follow
  end

  def destroy
    like = current_submission.likes.find_by_liker_id(current_user.id)
    
    like.destroy
    
    render json: []
  end
  
  def index
    user = Profile.find(params[:profile_id]).user
    
    if user
      @likes = user.likes
      render :index
    else
      render json: [], status: :unprocessable_entity
    end   
  end

  private

  def current_submission
    @current_submission ||= Submission.find(params[:submission_id])
  end
end
