class Api::UsersController < ApplicationController  
  before_action :require_authenticated!, only: :show
  
  def show
    @user = current_user
  end
end
