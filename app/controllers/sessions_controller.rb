class SessionsController < ApplicationController
  before_action :require_unauthenticated!, except: :destroy
    
  def new
  end

  def create
    user = User.find_by_credentials(session_params[:email_address],
                                    session_params[:password])
                                    
    if user
      sign_in!(user)
      redirect_to root_url
    else
      flash.now[:errors] = ["Invalid username or password."]
      render :new
    end
  end

  def destroy
    sign_out!
    redirect_to root_url
  end
  
  private
  
  def session_params
    params.require(:session).permit(:email_address, :password)
  end
end
