# == Schema Information
#
# Table name: likes
#
#  id         :integer          not null, primary key
#  liker_id   :integer          not null
#  likee_id   :integer          not null
#  created_at :datetime
#  updated_at :datetime
#

class Like < ActiveRecord::Base
  validates :liker, :likee, presence: true
  validates :likee, uniqueness: { scope: :liker }
  
  belongs_to :likee, class_name: "Submission", foreign_key: :likee_id,
    counter_cache: true
  belongs_to :liker, class_name: "User", foreign_key: :liker_id
end
