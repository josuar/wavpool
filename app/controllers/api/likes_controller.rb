class Api::LikesController < ApplicationController
  def create
    @follow = current_user.likes.create(likee: current_submission)
    
    render json: @follow
  end

  def destroy
    like = current_user.likes.find_by_liker_id(current_user.id)
    
    like.destroy
    
    render json: []
  end

  private

  def current_submission
    @current_submission ||= Submission.find(params[:submission_id])
  end
end
