class Api::SubmissionsController < ApplicationController
  def create
    @submission = current_user.submissions.new(submission_params)
    
    if @submission.save
      render :show
    else
      render json: @submission.errors.full_messages,
        status: :unprocessable_entity
    end
  end
  
  def show
    @submission = Submission.includes(user: :profile).find(params[:id])
    
    render :show
  end
  
  def update
    @submission = Submission.find(params[:id])
    
    if @submission.update(submission_params)
      render :show
    else
      render json: @submission.errors.full_messages,
        status: :unprocessable_entity
    end
  end
  
  private

  def submission_params
    params.require(:submission).permit(
      :title, :description, :remote_url, :image_url, :duration
    )
  end
end
