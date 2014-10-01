class Api::SurfsController < ApplicationController
  def show
    @surf = current_user.surf
  end
end
