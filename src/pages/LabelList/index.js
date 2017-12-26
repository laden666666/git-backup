export default {
    template: require('./template'),
    data: function(){
        return {

        }
    },
    computed: {
        labelList(){
            return this.$store.state.labels
        }
    },
}