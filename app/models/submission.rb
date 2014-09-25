# == Schema Information
#
# Table name: submissions
#
#  id          :integer          not null, primary key
#  title       :string(255)      not null
#  remote_url  :string(255)      not null
#  image_url   :string(255)      not null
#  description :text
#  user_id     :integer          not null
#  created_at  :datetime
#  updated_at  :datetime
#

class Submission < ActiveRecord::Base
  validates :image_url, :remote_url, :user, presence: true
  validate :image_url_is_valid_image
  validate :remote_url_is_valid_audio
  
  after_initialize :ensure_picture
  
  belongs_to :user
  
  private
  
  def ensure_picture
    self.image_url ||= 'default.gif';
  end
  
  def image_url_is_valid_image
    return
    
    url = URI.parse(self.image_url)
    
    Net::HTTP.start(url.host, url.port) do |http|
      unless http.head(url.path)['Content-Type'].start_with? 'image'
        errors.add(:image_url, 'must be a valid image')
      end
    end
  end
  
  def remote_url_is_valid_audio
    return 
    
    url = URI.parse(self.audio_url)
    
    Net::HTTP.start(url.host, url.port) do |http|
      unless http.head(url.path)['Content-Type'].start_with? 'audio'
        errors.add(:audio_url, 'must be a valid audio file')
      end
    end
  end
end
