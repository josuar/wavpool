class Api::SubmissionsController < ApplicationController
  def create
    @submission = current_user.submissions.new(submission_params)
    
    if @submission.save
      render json: @submission
    else
      render json: @submission.errors.full_messages,
        status: :unprocessable_entity
    end
  end
  
  def show
  end
  
  def update
  end
  
  private

  def submission_params
    params.require(:submission).permit(
      :title, :description, :remote_url, :image_url
    )
  end
end
