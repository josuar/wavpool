class Api::ProfilesController < ApplicationController
  def show
    render json: current_profile
  end
  
  def update
    if current_profile.update(profile_params)
      render json: current_profile
    else
    end
  end
  
  private
  
  def profile_params
    params.require(:profile).permit(
      :display_name, :full_name, :location, :description
    )
  end
  
  def current_profile
    @current_profile ||= Profile.find(params[:id])
  end
end
