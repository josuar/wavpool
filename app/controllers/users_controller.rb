class UsersController < ApplicationController  
  before_action :require_unauthenticated!
  
  def new        
    @user = User.new
  end

  def create
    @user = User.new(user_params)
    @user.build_profile(profile_params)
    
    if @user.save
      sign_in!(@user)
      redirect_to root_url
    else
      flash.now[:errors] = @user.errors.full_messages
      render :new
    end
  end
  
  private
  
  def user_params
    params.require(:user).permit(:email_address, :password)
  end

  def profile_params
    params.require(:profile).permit(:display_name)
  end
end
