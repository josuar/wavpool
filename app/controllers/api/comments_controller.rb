class Api::CommentsController < ApplicationController
  def create
    submission = Submission.find(params[:submission_id])
    @comment = submission.comments.new(comment_params)
    @comment.user = current_user
    
    if @comment.save
      render json: @comment
    else
      render json: @comment.errors.full_messages, status: :unprocessable_entity
    end
  end
  
  private
  
  def comment_params
    params.require(:comment).permit(
      :submission_id,
      :track_timestamp,
      :track_location,
      :content,
      :track_position )
  end
end
