# == Schema Information
#
# Table name: comments
#
#  id              :integer          not null, primary key
#  user_id         :integer          not null
#  submission_id   :integer          not null
#  track_timestamp :integer          default(0)
#  content         :text             not null
#  created_at      :datetime
#  updated_at      :datetime
#

class Comment < ActiveRecord::Base
  validates :user, :submission, :content, presence: true
  
  belongs_to :user
  belongs_to :submission
end
