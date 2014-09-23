class ProfilesController < ApplicationController
  def show
    render json: current_profile
  end
  
  def edit
  end
  
  def update
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
