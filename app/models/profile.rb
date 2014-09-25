# == Schema Information
#
# Table name: profiles
#
#  id           :integer          not null, primary key
#  user_id      :string(255)      not null
#  display_name :string(255)      not null
#  full_name    :string(255)
#  location     :string(255)
#  description  :text
#  created_at   :datetime
#  updated_at   :datetime
#  picture_url  :string(255)
#

class Profile < ActiveRecord::Base  
  validates :picture_url, :display_name, presence: true
  validate :picture_url_is_valid_image
  
  after_initialize :ensure_picture
  
  belongs_to :user
  
  private
  
  def ensure_picture
    self.picture_url ||= 'default.gif';
  end
  
  def picture_url_is_valid_image
    url = URI.parse(self.picture_url)
    
    Net::HTTP.start(url.host, url.port) do |http|
      unless http.head(url.path)['Content-Type'].start_with? 'image'
        errors.add(:picture_url, 'must be a valid image')
      end
    end
  end
end
