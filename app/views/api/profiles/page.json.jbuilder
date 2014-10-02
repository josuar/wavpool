json.submissions @submissions do |submission|
  json.partial! 'api/submissions/submission', submission: submission
end
