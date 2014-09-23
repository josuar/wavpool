class StaticController < ApplicationController
  before_action :require_authenticated!
  
  def root
  end
end
