class Api::ProfilesController < ApplicationController
  before_action :require_profile_ownership!, only: :update
  
  def show
    render json: current_profile
  end
  
  def update
    profile = current_profile
    
    if profile.update(profile_params)
      render json: profile
    else
      render json: profile.errors.full_messages, status: :unprocessable_entity
    end
  end
  
  private
  
  def profile_params
    params.require(:profile).permit(
      :display_name, :full_name, :location, :description, :picture_url
    )
  end
  
  def current_profile
    @current_profile ||= Profile.find(params[:id])
  end
  
  def require_profile_ownership!
    if current_user.profile != current_profile
      render json: ["This profile does not belong to you."], status: 403
    end
  end
end
