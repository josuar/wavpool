class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
  
  helper_method :current_user, :signed_in?
  
  def sign_in!(user)
    user.reset_session_token!
    session[:session] = user.session_token
  end
  
  def sign_out!
    current_user.try(:reset_session_token!)
    session[:session] = nil
  end
  
  def current_user
    return nil unless session[:session]
    
    @current_user ||= User.find_by_session_token(session[:session])
  end
  
  def signed_in?
    !!current_user
  end
  
  def require_authenticated!
    unless signed_in?
      flash[:errors] = ["You must be signed in to perform that action."]
      redirect_to new_session_url
    end
  end
  
  def require_unauthenticated!
    if signed_in?
      flash[:errors] = ["You are already signed in!"]
      redirect_to root_url
    end
  end
end
