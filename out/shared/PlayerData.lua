-- Compiled with roblox-ts v2.2.0
return {
	ChangeMoney = function(replica, method, value)
		local FinalValue = if method == "Add" then replica.Data.Money + value else replica.Data.Money - value
		if FinalValue < 0 then
			return replica:SetValue({ "Money" }, 0)
		end
		replica:SetValue({ "Money" }, FinalValue)
	end,
}
