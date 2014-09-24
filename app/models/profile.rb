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
  validates :display_name, presence: true
  
  after_initialize :ensure_display_name
  
  belongs_to :user
  
  has_attached_file :picture, styles: {
    big:   "200x200>",
    small: "48x48#"
  }
  
  validates_attachment_content_type :picture, content_type: /\Aimage\/.*\Z/
  
  private
  
  def ensure_display_name
    self.display_name ||= 'Generic Surfer'
  end
end
