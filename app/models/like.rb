class Like < ActiveRecord::Base
  validates :liker, :likee, presence: true
  validates :likee, uniqueness: { scope: :liker }
  
  belongs_to :likee, class_name: "Submission", foreign_key: :likee_id
  belongs_to :liker, class_name: "User", foreign_key: :liker_id
end
